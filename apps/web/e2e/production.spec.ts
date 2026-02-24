import { test, expect } from '@playwright/test'

test.describe('Production System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  test('should update workers when slider is moved', async ({ page }) => {
    await page.goto('/production')
    
    const buildingButton = page.locator('text=+ 新建农田')
    await buildingButton.click()
    
    await page.waitForTimeout(500)
    
    const workerCountSpan = page.locator('.bg-slate-700.rounded.p-3').first()
      .locator('.flex.justify-between.text-sm').first()
      .locator('span').first()
    const initialCount = await workerCountSpan.textContent()
    console.log('Initial worker count:', initialCount)
    
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]') as HTMLInputElement
      if (slider) {
        slider.value = '10'
        slider.dispatchEvent(new Event('input', { bubbles: true }))
        slider.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })
    
    await page.waitForTimeout(500)
    
    const updatedCount = await workerCountSpan.textContent()
    console.log('Updated worker count:', updatedCount)
    
    expect(updatedCount).toContain('10')
  })

  test('should produce resources when building has workers', async ({ page }) => {
    await page.goto('/production')
    
    page.on('console', msg => {
      console.log('Browser console:', msg.type(), msg.text())
    })
    
    const tickBefore = await page.locator('text=Tick:').textContent()
    console.log('Tick count before:', tickBefore)
    
    const buildingButton = page.locator('text=+ 新建农田')
    await buildingButton.click()
    
    await page.waitForTimeout(500)
    
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]') as HTMLInputElement
      if (slider) {
        slider.value = '10'
        slider.dispatchEvent(new Event('input', { bubbles: true }))
        slider.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })
    
    await page.waitForTimeout(500)
    
    const workerCountAfter = await page.locator('.bg-slate-700.rounded.p-3').first()
      .locator('.flex.justify-between.text-sm').first()
      .locator('span').first()
      .textContent()
    console.log('Worker count after update:', workerCountAfter)
    
    const gameInfo = await page.evaluate(() => {
      const game = (window as any).__game
      if (game && game.state && game.state.value) {
        const buildings = Array.from(game.state.value.buildings.values())
        return {
          buildingsCount: buildings.length,
          buildings: buildings.map((b: any) => ({
            id: b.id,
            type: b.type,
            currentWorkers: b.currentWorkers,
            maxWorkers: b.maxWorkers,
            baseWorkers: b.baseWorkers,
            baseThroughput: b.baseThroughput,
            productionMethods: b.productionMethods,
            tileId: b.tileId
          })),
          tiles: Array.from(game.state.value.tiles.values()).map((t: any) => ({
            id: t.id,
            name: t.name,
            storage: Array.from(t.storage.entries())
          }))
        }
      }
      return null
    })
    console.log('Game info:', JSON.stringify(gameInfo, null, 2))
    
    await page.waitForTimeout(5000)
    
    const productionLogs = await page.evaluate(() => {
      const logs: string[] = []
      const originalLog = console.log
      console.log = (...args: any[]) => {
        logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '))
        originalLog.apply(console, args)
      }
      return logs
    })
    console.log('Production logs:', productionLogs)
    
    const tickAfter = await page.locator('text=Tick:').textContent()
    console.log('Tick count after:', tickAfter)
    
    const tileStorageSection = page.locator('main').getByText('地块库存').locator('..')
    const emptyStorageText = await tileStorageSection.textContent()
    console.log('Storage text after 5s:', emptyStorageText)
    
    const resourceRows = tileStorageSection.locator('.bg-slate-700.rounded.p-3 .space-y-1 .flex')
    const count = await resourceRows.count()
    console.log('Resource row count:', count)
    
    const emptyStorageCount = await tileStorageSection.locator('.bg-slate-700.rounded.p-3').filter({ hasText: '空仓' }).count()
    console.log('Empty storage count:', emptyStorageCount)
    
    const hasResources = count > 0 || emptyStorageCount === 0
    console.log('Has resources:', hasResources)
    
    expect(hasResources).toBe(true)
  })

  test('should not produce when workers are set to zero', async ({ page }) => {
    await page.goto('/production')
    
    const buildingButton = page.locator('text=+ 新建农田')
    await buildingButton.click()
    
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]') as HTMLInputElement
      if (slider) {
        slider.value = '0'
        slider.dispatchEvent(new Event('input', { bubbles: true }))
        slider.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })
    
    await page.waitForTimeout(3000)
    
    const tileStorageSection = page.locator('main').getByText('地块库存').locator('..')
    const emptyStorageCount = await tileStorageSection.locator('.bg-slate-700.rounded.p-3').filter({ hasText: '空仓' }).count()
    
    expect(emptyStorageCount).toBeGreaterThan(0)
  })
})

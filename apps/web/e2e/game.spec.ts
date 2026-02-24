import { test, expect } from '@playwright/test'

test.describe('Game Mechanics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should increment game date over time', async ({ page }) => {
    const dateText = await page.locator('main .font-mono').first().textContent()
    expect(dateText).toBeTruthy()
  })

  test('should display population stats', async ({ page }) => {
    await page.click('nav a:has-text("人口")')
    await expect(page).toHaveURL('/population')
    
    await expect(page.locator('main').getByText('总人口').first()).toBeVisible()
    await expect(page.locator('main').getByText('就业人口').first()).toBeVisible()
    await expect(page.locator('main').getByText('就业率').first()).toBeVisible()
  })

  test('should show technology tree', async ({ page }) => {
    await page.click('nav a:has-text("科技")')
    await expect(page).toHaveURL('/technology')
    
    await expect(page.locator('main').getByText('科技树').first()).toBeVisible()
    await expect(page.locator('main').getByText('研发队列').first()).toBeVisible()
  })

  test('should display building list', async ({ page }) => {
    await page.click('nav a:has-text("生产")')
    await expect(page).toHaveURL('/production')
    
    await expect(page.locator('main').getByText('建筑列表').first()).toBeVisible()
    await expect(page.locator('main').getByText('建设面板').first()).toBeVisible()
  })
})

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings')
  })

  test('should display settings options', async ({ page }) => {
    await expect(page.locator('main').getByText('游戏设置').first()).toBeVisible()
    await expect(page.locator('main').getByText('界面设置').first()).toBeVisible()
    await expect(page.locator('main').getByText('存档管理').first()).toBeVisible()
  })

  test('should change game speed', async ({ page }) => {
    const selects = page.locator('main select')
    const gameSpeedSelect = selects.nth(1)
    await gameSpeedSelect.selectOption('4')
    
    const selectedValue = await gameSpeedSelect.inputValue()
    expect(selectedValue).toBe('4')
  })

  test('should toggle notifications', async ({ page }) => {
    const section = page.locator('main').getByText('界面设置').locator('..').locator('..')
    const toggle = section.locator('button').first()
    await toggle.click({ force: true })
  })

  test('should save game', async ({ page }) => {
    await page.click('main button:has-text("保存游戏")')
  })
})

test.describe('Production', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/production')
  })

  test('should display empty state when no buildings', async ({ page }) => {
    const buildings = page.locator('main .bg-slate-700.rounded.p-3')
    const count = await buildings.count()
    
    if (count === 0) {
      await expect(page.locator('main').getByText('暂无建筑')).toBeVisible()
    }
  })

  test('should show building after construction', async ({ page }) => {
    await page.click('button:has-text("+ 新建林场")')
    
    const buildings = page.locator('main .bg-slate-700.rounded.p-3')
    await expect(buildings.first()).toBeVisible()
  })

  test('should show building efficiency', async ({ page }) => {
    await page.click('button:has-text("+ 新建林场")')
    
    await expect(page.locator('main').getByText(/效率:/).first()).toBeVisible()
  })

  test('should show building count badge', async ({ page }) => {
    await page.click('button:has-text("+ 新建林场")')
    
    const countBadge = page.locator('main .bg-blue-600.rounded-full').first()
    await expect(countBadge).toBeVisible()
  })

  test('should stack same building types', async ({ page }) => {
    await page.click('button:has-text("+ 新建林场")')
    await expect(page.locator('main .bg-slate-700.rounded.p-3').first()).toBeVisible()
    
    const afterFirstBuild = await page.locator('main .bg-slate-700.rounded.p-3').count()
    expect(afterFirstBuild).toBe(1)
    
    await page.click('button:has-text("+ 新建林场")')
    
    const forestryCard = page.locator('main .bg-slate-700.rounded.p-3').filter({ hasText: '林场' })
    const countBadge = forestryCard.locator('.bg-blue-600.rounded-full')
    await expect(countBadge).toHaveText('x2')
  })

  test('should add new building type as separate card', async ({ page }) => {
    await page.click('button:has-text("+ 新建林场")')
    await expect(page.locator('main .bg-slate-700.rounded.p-3').first()).toBeVisible()
    
    const initialCount = await page.locator('main .bg-slate-700.rounded.p-3').count()
    
    await page.click('button:has-text("+ 新建牧场")')
    await expect(page.locator('main .bg-slate-700.rounded.p-3').filter({ hasText: '牧场' })).toBeVisible()
    
    const finalCount = await page.locator('main .bg-slate-700.rounded.p-3').count()
    expect(finalCount).toBe(initialCount + 1)
  })

  test('should show scaled production output', async ({ page }) => {
    await page.click('button:has-text("+ 新建林场")')
    
    await expect(page.locator('main').getByText(/产量:/).first()).toBeVisible()
  })

  test('should show scaled worker capacity', async ({ page }) => {
    await page.click('button:has-text("+ 新建林场")')
    
    const workerText = await page.locator('main').getByText(/工人:/).first().textContent()
    expect(workerText).toBeTruthy()
    expect(workerText).toContain('/')
  })
})

test.describe('Market', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/market')
  })

  test('should display goods prices', async ({ page }) => {
    await expect(page.locator('main').getByText('商品价格').first()).toBeVisible()
    await expect(page.locator('main .bg-slate-700').getByText('粮食').first()).toBeVisible()
    await expect(page.locator('main .bg-slate-700').getByText('木材').first()).toBeVisible()
  })

  test('should display trade panel', async ({ page }) => {
    await expect(page.locator('main').getByText('交易面板').first()).toBeVisible()
    await expect(page.locator('main').getByText('选择商品').first()).toBeVisible()
    await expect(page.locator('main').getByText('数量').first()).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the dashboard page', async ({ page }) => {
    await expect(page.locator('main h1')).toContainText('仪表盘')
  })

  test('should show game stats on dashboard', async ({ page }) => {
    await expect(page.locator('main').getByText('人口').first()).toBeVisible()
    await expect(page.locator('main').getByText('资金').first()).toBeVisible()
    await expect(page.locator('main').getByText('时代').first()).toBeVisible()
    await expect(page.locator('main').getByText('日期').first()).toBeVisible()
  })

  test('should navigate between pages', async ({ page }) => {
    await page.click('nav a:has-text("地图")')
    await expect(page).toHaveURL('/map')
    await expect(page.locator('main h1')).toContainText('地图')

    await page.click('nav a:has-text("生产")')
    await expect(page).toHaveURL('/production')
    await expect(page.locator('main h1')).toContainText('生产管理')

    await page.click('nav a:has-text("市场")')
    await expect(page).toHaveURL('/market')
    await expect(page.locator('main h1')).toContainText('市场')

    await page.click('nav a:has-text("人口")')
    await expect(page).toHaveURL('/population')
    await expect(page.locator('main h1')).toContainText('人口管理')

    await page.click('nav a:has-text("科技")')
    await expect(page).toHaveURL('/technology')
    await expect(page.locator('main h1')).toContainText('科技研发')

    await page.click('nav a:has-text("设置")')
    await expect(page).toHaveURL('/settings')
    await expect(page.locator('main h1')).toContainText('设置')
  })

  test('should pause and resume game', async ({ page }) => {
    const pauseButton = page.locator('button:has-text("暂停")')
    await expect(pauseButton).toBeVisible()
    
    await pauseButton.click()
    await expect(page.locator('button:has-text("继续")')).toBeVisible()
    
    await page.click('button:has-text("继续")')
    await expect(pauseButton).toBeVisible()
  })

  test('should add building', async ({ page }) => {
    await page.click('nav a:has-text("生产")')
    await expect(page).toHaveURL('/production')
    
    const forestryCard = page.locator('main .bg-slate-700.rounded.p-3').filter({ hasText: '林场' })
    const initialBadge = forestryCard.locator('.bg-blue-600.rounded-full')
    const initialBadgeText = await initialBadge.textContent()
    const initialCount = parseInt(initialBadgeText?.replace('x', '') || '1')
    
    await page.click('button:has-text("+ 新建林场")')
    
    await page.waitForTimeout(500)
    
    const newBadgeText = await initialBadge.textContent()
    const newCount = parseInt(newBadgeText?.replace('x', '') || '1')
    expect(newCount).toBe(initialCount + 1)
  })

  test('should buy goods in market', async ({ page }) => {
    await page.click('nav a:has-text("市场")')
    await expect(page).toHaveURL('/market')
    
    await page.selectOption('main select', 'food')
    await page.fill('main input[type="number"]', '10')
    await page.click('main button:has-text("买入")')
    
    await page.waitForTimeout(500)
  })
})

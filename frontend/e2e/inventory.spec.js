import { test, expect } from '@playwright/test'

test('crea una categoría y un producto desde la interfaz', async ({ page }) => {
  const suffix = Date.now().toString()
  const category = `Categoría ${suffix}`
  const product = `Producto ${suffix}`

  await page.goto('/')
  await page.getByLabel('Nombre de categoría').fill(category)
  await page.getByRole('button', { name: 'Agregar categoría' }).click()
  await expect(page.getByTestId('category-list')).toContainText(category)

  await page.getByLabel('Nombre de producto').fill(product)
  await page.getByLabel('Categoría', { exact: true }).selectOption({ label: category })
  await page.getByRole('button', { name: 'Agregar producto' }).click()
  await expect(page.getByTestId('product-list')).toContainText(product)
  await expect(page.getByTestId('product-list')).toContainText(category)
})

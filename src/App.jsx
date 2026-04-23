import { useEffect, useState } from 'react'
import { getProducts } from './services/products'

function App() {
  // State hooks for updating products array using database data
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)

  // Fetches/pulls data from "Products" table found in supabase
  useEffect(() => {
    getProducts()
        .then(data => setProducts(data))
        .catch(err => setError(err.message))
  }, [])

  // Renders error message if fetch failed
  if (error) return <div>Error: {error}</div>

  return (
      <div>
        <h1 style={{ color: 'black' }}>NSC Merch Store</h1>
        {products.map(product => (
            <div key={product.id}>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <p>In stock: {product.inventory_count}</p>
            </div>
        ))}
      </div>
  )
}

export default App
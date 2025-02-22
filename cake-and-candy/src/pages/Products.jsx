import products from "../products"
import Product from "../components/Product"

function Products() {
    return (
      <div>
        <h1>Willkommen bei Produkte</h1>
        <div className="flex justify-center items-center min-h-screen ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product, index) => (
              <Product
                key={index}
                image={product.image}
                title={product.title}
                description={product.description}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  export default Products;
  
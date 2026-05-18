import '../assets/css/shop.css';

function Shop() {
    
    const handleShop = () => {
        alert("ceci est la boutique");
    };

    return (
        <>
          <header className="shop-header">
            <h1>Boutique</h1>
          </header>

          <main className="shop-actions">
            <button className="btn-primary" onClick={handleShop}>
              acheter
            </button>
          </main>
        </>
    )
}

export default Shop
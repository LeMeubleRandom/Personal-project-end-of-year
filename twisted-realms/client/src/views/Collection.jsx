import '../assets/css/collection.css';

function Collection() {

    const handleCollection = () => {
        alert("ceci est ma collection");
    }

    return (
        <>
          <header className="collection-header">
            <h1>Ma collection</h1>
          </header>
          
          <main className="collection-actions">
            <button className="btn-primary" onClick={handleCollection}>
                check
            </button>
          </main>
        </>
    )
}

export default Collection
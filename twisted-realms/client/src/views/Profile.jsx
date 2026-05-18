import '../assets/css/profile.css';

function Profile() {

    const handleStats = () => {
        alert("Je montre mes stats");
    };

    return (
        <>
            <header className="profile-header">
                <h1>Mon profil</h1>
            </header>

            <main className="profile-actions">
                <button className="btn-primary" onClick={handleStats}>
                    Stats
                </button>
            </main>
        </>
    )
}

export default Profile
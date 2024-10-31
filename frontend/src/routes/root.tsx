export default function Root() {
    return (
      <>
        <nav className="menu">
          <div>
            <h1>ITFE</h1>
          </div>
          <div>
            <a href="/">Accueil</a>
          </div>
          <div>
            <a href="/signup">inscription</a>
          </div>
          <div>
            <a href="/signin">connexion</a>
          </div>
        </nav>
        <input type='file'/>
      </>
    );
  }
  
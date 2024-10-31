const SignInPage = () =>{
    return(
        <div>
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
            <h2>Sign in</h2>
            <form>
                <input placeholder="Name"></input>
                <input type="password" placeholder="Password"></input>
                <button>Sign In</button>
            </form>
        </div>
    );
}

export default SignInPage;
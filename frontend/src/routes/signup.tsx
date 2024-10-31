const SignUpPage = () =>{
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
            <h2>Sign up</h2>
            <form>
                <input placeholder="Name"></input>
                <input type="password" placeholder="Password"></input>
                <input type="password" placeholder="Confirm password"></input>
                <button>Sign up</button>
            </form>
        </div>
    );
}

export default SignUpPage;
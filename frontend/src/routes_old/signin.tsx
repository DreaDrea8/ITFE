import Menu from './menu'

const SignInPage = () =>{
    return(
        <div>
            <Menu />
            <div className='container'>
                <h2 className='sign'>Sign in</h2>
                <div className='form-container'>
                    <form>
                        <input placeholder="Name"></input>
                        <input type="password" placeholder="Password"></input>
                        <button>Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
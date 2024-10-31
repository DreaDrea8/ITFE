import Menu from './menu'

const SignUpPage = () =>{
    return(
        <div>
            <Menu />
            <div className='container'>
                <h2 className='sign'>Sign up</h2>
                <div className='form-container'>
                    <form>
                        <input placeholder="Name"></input>
                        <input type="password" placeholder="Password"></input>
                        <input type="password" placeholder="Confirm password"></input>
                        <div>
                            <button>Sign up</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;
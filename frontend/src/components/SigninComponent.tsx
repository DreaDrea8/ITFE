import { Link } from 'react-router-dom'

import './../assets/components/signinComponent.css'

import { useAppContext } from '../AppContext'


const SigninComponent: React.FC = () => {
  const appContext = useAppContext()


  const handleSubmit = async (event:  React.FormEvent<HTMLFormElement>) => {
    event.preventDefault() 

    try {
      const response = await fetch(`/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login: event.currentTarget.login.value,
          password: event.currentTarget.password.value
        })
      })
      const result = await response.json()
      appContext.updateApp({token: result.data.token})
  
      window.location.pathname = '/'
      return
    } catch (error) {
      console.error("Erreur lors du partage de fichier :", error)
    }
  }
  
  return (
    <div className="signin">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit} name='signin'>
        <div>
          <label htmlFor="login" className="interact-field">
            <fieldset>
              <input type="text" tabIndex={1} placeholder="Identifiant" name="login" id="login" autoComplete="off" minLength={2} required pattern="[A-Za-z0-9]+"/>
              <legend>Identifiant</legend>
            </fieldset>
          </label>
          <div>
            <button type='button' className="button-outline-info btn-tooltip">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
                <path d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 224 32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32l32 0 0-192-32 0c-17.7 0-32-14.3-32-32z"/>
              </svg>
            </button>
            <div className="info-tooltip">
              <p>Le nom d'utilisateur ne doit contenir que des lettres et des chiffres.</p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="password" className="interact-field">
            <fieldset>
              <input type="password" tabIndex={2} placeholder="Mot de passe" name="password" id="password" autoComplete="off" minLength={2} required />
              <legend>Mot de passe</legend>
            </fieldset>
          </label>
          <div style={{width: '30px'}}></div>
        </div>

        <button type="submit" tabIndex={3}>Valider</button>
      </form>
      <p>Pas encore de compte ? <Link to="/auth/signup"> Page d'Inscription</Link></p>
    </div>
  )
}

export default SigninComponent
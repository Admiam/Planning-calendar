import './App.css'
import Calendar from './components/Calendar'

function App() {

  return (
      <div className="">
          <nav className="navbar navbar-expand-lg bg-body-tertiary">
              <div className="container-fluid d-flex justify-content-between">
                  <form className=" justify-content-start">
                      <button className="btn btn-outline-success me-2" type="button">Vložit zakázku</button>
                  </form>
                  <form className="d-flex" role="search">
                      <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                      <button className="btn btn-outline-success" type="submit">Search</button>
                  </form>
              </div>
          </nav>
          <main className="flex-1 p-4">
              <Calendar/>
          </main>
          <aside className="w-25 border p-4">

          </aside>
      </div>
  )
}

export default App

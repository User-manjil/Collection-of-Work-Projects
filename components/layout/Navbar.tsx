export default function Navbar(){
    return(
       <div className="flex container">
        <div className=" site-header px-10 ">
            <div className="nav  flex justify-between items-center">
                <div className="nav-logo">MANJIL</div>
                <div className="nav-links">
                    <div className="nav-link">Work</div>
                    <div className="nav-link">About</div>
                    <div className="nav-link">Blog</div>
                    <div className="nav-link">Contact</div>
                </div>
            </div>
       </div>
       </div>
    )
}
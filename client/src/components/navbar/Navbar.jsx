import './navbar.scss';

const Navbar = () => {
    return (
        <div className='navbar'>
            <div className='logo'>
                <img src="/price-tag.svg" alt="icon" />
                <span>Price Estimate</span>
            </div>

            <div className="user">
                <span>Keng</span>
            </div>
        </div>
    )
}

export default Navbar
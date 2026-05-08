import { Container, Logo, LogoutBtn } from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header() {
    const authStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();

    const navItems = [
        {
            name: "Home",
            slug: "/",
            active: true,
        },
        {
            name: "Login",
            slug: "/login",
            active: !authStatus,
        },
        {
            name: "Signup",
            slug: "/signup",
            active: !authStatus,
        },
        {
            name: "All Posts",
            slug: "/all-posts",
            active: authStatus,
        },
        {
            name: "Add Post",
            slug: "/add-post",
            active: authStatus,
        },
    ];

    return (
        <header className="bg-blue-600 text-white py-4 shadow-lg">
            <Container>
                <nav className="flex items-center">
                    <div className="mr-4">
                        <Link to='/' className="flex items-center text-white hover:text-blue-200 transition">
                            <Logo width='70px' />
                            <span className="ml-2 text-xl font-bold hidden sm:block">BlogApp</span>
                        </Link>
                    </div>
                    <ul className="flex ml-auto space-x-4">
                        {
                            navItems.map((item) => (
                                item.active ? (
                                    <li key={item.name}>
                                        <button
                                            onClick={() => navigate(item.slug)}
                                            className="px-4 py-2 text-white hover:text-blue-200 hover:bg-blue-700 rounded-lg transition duration-200 font-medium"
                                        >
                                            {item.name}
                                        </button>
                                    </li>
                                ) : null
                            ))
                        }
                        {authStatus&&(
                            <li>
                                <LogoutBtn/>
                            </li>
                        )}
                    </ul>
                </nav>
            </Container>
        </header>
    )
}

export default Header;

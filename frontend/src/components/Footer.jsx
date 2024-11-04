import "../styles/Footer.css";

function Footer() {
    return(
        <footer>
            <p>&copy; {new Date().getFullYear()} Chess web app. All rights reserved.</p>
        </footer>
    )
}

export default Footer
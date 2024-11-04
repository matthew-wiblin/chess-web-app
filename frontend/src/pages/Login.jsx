import Form from "../components/Form"
import Header from "../components/Header"
import Footer from "../components/Footer";

function Login() {
    return (
    <>
        <Header />
        <Form route="/api/token/" method="login" />
        <Footer />
    </>
    );
}

export default Login
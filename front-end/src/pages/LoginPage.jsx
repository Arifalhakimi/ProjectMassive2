import { useState } from 'react';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import IconBengkel from '../assets/img/iconBengkel.png';
import { useNavigate } from "react-router-dom";
import LogoGoogle from "../assets/img/logogoogle.png";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const axiosHandler = async (url, data) => await axios.post(url, data);

const errorMessageDisplay = (text) => (
    <p
        style={{
            color: "red",
            fontSize: 12,
            marginTop: 0,
            paddingTop: 0,
            marginLeft: 5,
            marginBottom: 10,
            fontWeight: "bold",
        }}
    >
        {text}
    </p>
);

const LoginPage = () => {
    let Navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data) => {
        const value = {
            email: data.email,
            password: data.password,
        };

        const statement = `http://localhost:7730/api/v1/login`;
        console.log(statement);

        try {
            const response = await axiosHandler(statement, value);
    
            // Tambahkan pengecekan keamanan
            if (response && response.data) {
                const redirectUrl = response.data.redirectUrl;
                if (redirectUrl) {
                    Navigate(redirectUrl);
                } else {
                    // Handle other cases or display a message
                }
                Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: response.data,
                });
                reset();
            } else {
                // Handle the case where response or response.data is undefined/null
                console.error("Unexpected response format:", response);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response ? error.response.data : "An error occurred",
            });
        }
    };


    return (
        <Container fluid className="login-page w-100 min-vh-100">
            <Form onSubmit={handleSubmit(onSubmit)}>
                <img src={IconBengkel} alt="" />

                <Form.Group className="mb-3 mx-5" controlId="formBasicEmail">
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="email"><i className="fas fa-mail-bulk"></i></InputGroup.Text>
                        <Form.Control
                            placeholder="Masukan E-mail"
                            aria-label="email"
                            aria-describedby="email"
                            {...register("email", {
                                required: { value: true, message: "Input field required!" },
                            })}
                        />
                    </InputGroup>
                    {errors.email && errors.email.message
                        ? errorMessageDisplay(errors.email.message)
                        : null}
                </Form.Group>

                <Form.Group className="password mb-3 mx-5" controlId="formBasicPassword">
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">
                            {showPassword ? (
                                <i className="fas fa-eye" onClick={togglePasswordVisibility}></i>
                            ) : (
                                <i className="fas fa-eye-slash" onClick={togglePasswordVisibility}></i>
                            )}
                        </InputGroup.Text>
                        <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Masukkan kata sandi"
                            aria-describedby="password"
                            {...register("password", {
                                required: { value: true, message: "Input field required!" },
                            })}
                        />
                    </InputGroup>

                    <Form.Text className="lupa-kata-sandi d-flex justify-content-end">
                        <span> Lupa kata sandi</span>
                    </Form.Text>
                </Form.Group>

                <Button variant="danger" type="submit" className="rounded-5">
                    Masuk
                </Button>
                <Form.Text className="text-muted d-flex justify-content-center">
                    Atau masuk dengan
                </Form.Text>
                <div className="icon mt-2">
                    <img src={LogoGoogle} alt="" />
                </div>
                <Form.Text className="text-muted d-flex justify-content-center mb-5 mt-2">
                    Belum punya akun? <span onClick={() => Navigate('/register')}>Daftar</span>
                </Form.Text>
            </Form>
        </Container>
    );
};

export default LoginPage;

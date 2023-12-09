import { useState } from 'react';
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
// import IconBengkel from '../assets/img/iconBengkel.png'; // Pastikan path sesuai dengan struktur proyek Anda
import { useNavigate } from "react-router-dom";
const axiosHandler = async (url, data) => await axios.post(url, data);

const errorMessageDsplay = (text) => (
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


const RegisterPage = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    const Navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data) => {
        const value = {
            confPassword: data.confPassword,
            email: data.email,
            nama: data.nama,
            password: data.password,
        };

        const statement = `http://localhost:7730/api/v1/register`;

        try {
            const response = await axios.post(statement, value);
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: response.data,
            });
            reset();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response.data,
            });
        }
    };
    return (
        <Container fluid className="register-page w-100 min-vh-100">
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Text className="text-pendaftaran d-flex justify-content-center">
                    <h3>Pendaftaran</h3>
                </Form.Text>
                <Form.Group className="mb-3 mx-5" controlId="formBasicName">
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Masukan nama Lengkap"
                            aria-label="Username"
                            aria-describedby="nama"
                            {...register("nama", {
                                required: { value: true, message: "Input field required!" },
                            })}
                        />
                        <InputGroup.Text id="basic-addon1"><i className="fas fa-address-card"></i></InputGroup.Text>
                    </InputGroup>
                    {errors.nama && errors.nama.message
                        ? errorMessageDsplay(errors.nama.message)
                        : null}
                </Form.Group>
                <Form.Group className="mb-3 mx-5" controlId="formBasicEmail">
                    <InputGroup className="mb-3">

                        <Form.Control
                            placeholder="Masukan E-mail"
                            aria-label="email"
                            aria-describedby="email"
                            {...register("email", {
                                required: { value: true, message: "Input field required!" },
                            })}
                        />
                        <InputGroup.Text id="basic-addon1"><i className="fas fa-mail-bulk"></i></InputGroup.Text>
                    </InputGroup>
                    {errors.email && errors.email.message
                        ? errorMessageDsplay(errors.email.message)
                        : null}
                </Form.Group>

                <Form.Group className="password mb-3 mx-5" controlId="formBasicPassword">
                    <InputGroup className="mb-3">
                        <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Masukkan kata sandi"
                            aria-describedby="password"
                            {...register("password", {
                                required: { value: true, message: "Input field required!" },
                            })}
                        />
                        <InputGroup.Text id="basic-addon1">
                            {showPassword ? (
                                <i className="fas fa-eye" onClick={togglePasswordVisibility}></i>
                            ) : (
                                <i className="fas fa-eye-slash" onClick={togglePasswordVisibility}></i>
                            )}
                        </InputGroup.Text>
                    </InputGroup>
                    {errors.password && errors.password.message
                        ? errorMessageDsplay(errors.password.message)
                        : null}
                </Form.Group>

                <Form.Group className="password mb-3 mx-5" controlId="formBasicConfirmPassword">
                    <InputGroup className="mb-3">
                        <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Konfirmasi kata sandi"
                            aria-describedby="confPassword"
                            {...register("confPassword", {
                                required: { value: true, message: "Input field required!" },
                            })}
                        />
                        <InputGroup.Text id="basic-addon1">
                            {showPassword ? (
                                <i className="fas fa-eye" onClick={togglePasswordVisibility}></i>
                            ) : (
                                <i className="fas fa-eye-slash" onClick={togglePasswordVisibility}></i>
                            )}
                        </InputGroup.Text>
                    </InputGroup>
                    {errors.confPaswword && errors.confPaswword.message
                        ? errorMessageDsplay(errors.confPaswword.message)
                        : null}
                </Form.Group>

                <Button variant="danger" type="submit" className="rounded-5" >
                    Daftar
                </Button>
                <div className="icon mb-2 mt-2">
                    <i className="fab fa-google"></i>
                </div>
                <Form.Text className="text-muted d-flex justify-content-center mb-5">
                    Sudah punya akun? <span onClick={() => Navigate('/login')}>Masuk</span>
                </Form.Text>
            </Form>
        </Container>
    );
};

export default RegisterPage;

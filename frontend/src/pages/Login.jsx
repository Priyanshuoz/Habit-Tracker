import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(false);

        try{
            const res = await API.post('/auth/login', formData);
            login(res.data);
            navigate('/');
        }catch(err){
            setError(err.response?.data?.message)
        }finally{
            setLoading(false);
        }
    };

    
}


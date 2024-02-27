import { useState } from 'react';

const useForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e) => {
        setFormData(formData => ({ ...formData, [e.target.name]: e.target.value }));
        isSubmitted && setIsSubmitted(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit && onSubmit(e);
        setIsSubmitted(true);
    }

    return {
        formData,
        isSubmitted,
        handleInputChange,
        handleSubmit
    };
};

export { useForm }
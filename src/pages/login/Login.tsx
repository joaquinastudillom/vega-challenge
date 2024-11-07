import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { login } from '@/services';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const Login = () => {
    const navigate = useNavigate();
    const form = useForm({
        defaultValues: {
            username: '',
            password: ''
        }
    });

    const handleLogin = () => {
        const { username, password } = form.getValues();
        if (login(username, password)) {
            navigate('/home');
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="type your username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="type your password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
};

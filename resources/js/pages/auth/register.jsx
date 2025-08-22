import { Head, useForm } from '@inertiajs/react'
import { LoaderCircle } from 'lucide-react'

import InputError from '@/components/input-error'
import TextLink from '@/components/text-link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    const submit = (e) => {
        e.preventDefault()
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        })
    }

    return (
        <>
            <Head title="Register" />

            {/* Background gradient sama kaya login */}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
                {/* Card Register */}
                <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
                    <h1 className="text-3xl font-bold text-center text-gray-800">
                        Buat Akun Baru ✨
                    </h1>
                    <p className="text-center text-gray-500 mt-2">
                        Masukkan detail Anda untuk membuat akun
                    </p>

                    <form className="flex flex-col gap-6 mt-6" onSubmit={submit}>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Nama lengkap"
                                className="block w-full text-gray-700"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                                className="block w-full text-gray-700"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Password"
                                className="block w-full text-gray-700"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Ulangi password"
                                className="block w-full text-gray-700"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white"
                            tabIndex={5}
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Buat Akun
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <TextLink href={route('login')} className="text-blue-600 hover:underline" tabIndex={6}>
                            Login
                        </TextLink>
                    </div>
                </div>
            </div>
        </>
    )
}

'use server'
import { redirect } from 'next/navigation'
import { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
// import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from '@/utils/authUtils'
import { zodValidator } from '@/lib/zodValidator'
import { loginValidationZodSchema } from '@/zod/auth.zodSchema'
import { parse } from "cookie";
import { setCookie } from '@/utils/tokenHandler'
import { UserRole } from '@/types/user.interface'

export const userLogin = async (_currentState: any, formData: any): Promise<any> => {
    try {
        const redirectTo = formData.get('redirect') || null
        let accessTokenObj: null | any = null
        let refreshTokenObj: null | any = null

        const payload = {
            email: formData.get('email'),
            password: formData.get('password')
        }

        // Validate with zod
        if (zodValidator(payload, loginValidationZodSchema).success === false) {
            return zodValidator(payload, loginValidationZodSchema);
        }

        const validatedPayload = zodValidator(payload, loginValidationZodSchema).data;

        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(validatedPayload)
        })

        const result = await res.json()

        const setCookieHeaders = res.headers.getSetCookie()

        if (setCookieHeaders && setCookieHeaders.length > 0) {
            setCookieHeaders.forEach((cookie: string) => {
                const parsedCookie = parse(cookie)

                if (parsedCookie['accessToken']) {
                    accessTokenObj = parsedCookie
                }
                if (parsedCookie['refreshToken']) {
                    refreshTokenObj = parsedCookie
                }
            })
        } else {
            throw new Error('No set-cookie header found')
        }

        if (!accessTokenObj) {
            throw new Error('Access Token object not found in cookies')
        }

        if (!refreshTokenObj) {
            throw new Error('Refresh Token object not found in cookies')
        }


        // Set acceess token to browser cookie
        await setCookie('accessToken', accessTokenObj.accessToken, {
            httpOnly: true,
            maxAge: parseInt(accessTokenObj['Max-Age'] || 1000 * 60 * 60),
            path: accessTokenObj.Path || '/',
            secure: true,
            sameSite: accessTokenObj.SameSite
        })

        // Set refresh token to browser cookie
        await setCookie('refreshToken', refreshTokenObj.refreshToken, {
            httpOnly: true,
            maxAge: parseInt(refreshTokenObj['Max-Age']),
            path: refreshTokenObj.Path || '/',
            secure: true,
            sameSite: refreshTokenObj.SameSite
        })


        // Verify token 
        const verifiedToken: JwtPayload | string = jwt.verify(accessTokenObj.accessToken, process.env.JWT_ACCESS_SECRET as string)

        if (typeof verifiedToken === 'string') {
            throw new Error('Invalid token')
        }

        const userRole: UserRole = verifiedToken.role

        if (!result.success) {
            throw new Error(result?.message || 'Login failed')
        }


        // if (redirectTo) {
        //     const redirectPath = redirectTo.toString()
        //     if (isValidRedirectForRole(redirectPath, userRole)) {
        //         redirect(`${redirectPath}?login=true`)
        //     } else {
        //         redirect(`${getDefaultDashboardRoute(userRole)}?login=true`)
        //     }
        // } else {
        //     redirect(`${getDefaultDashboardRoute(userRole)}?login=true`)
        // }


        redirect('/')

    } catch (err: any) {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) {
            throw err
        }
        console.log('Error while user loging', err)
        return { success: false, error: err, message: process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? err?.message : 'Login failed. Please check your credentials.' }
    }
}
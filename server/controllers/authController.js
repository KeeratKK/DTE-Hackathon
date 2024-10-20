    import User from '../models/userSchema.js';
    import { hashPassword, comparePasswords } from '../helpers/auth.js';
    import jwt from 'jsonwebtoken';
import { Patient } from '../models/patientModel.js';
import { Doctor } from '../models/doctorModel.js';

    export const test = (req, res) => {
        res.json('test is working');
    };

    export const registerUser = async (req, res) => {
        try {
            const { first_name, last_name, email, password, role } = req.body;

            if (!first_name || !last_name) {
                return res.json({
                    error: 'Name is required!',
                });
            }
            if (!password || password.length < 6) {
                return res.json({
                    error: 'Password is required and should be at least 6 characters long!',
                });
            }

            const exist = await User.findOne({ email });
            if (exist) {
                return res.json({
                    error: 'Email is already taken!',
                });
            }

            const hashedPassword = await hashPassword(password);

            const user = await User.create({
                first_name,
                last_name,
                email,
                password: hashedPassword,
                role,
            });

            if(role === 'Doctor'){
                await Doctor.create({
                    user_id: user._id,
                    patients: []
                });
            }

            jwt.sign(
                { email: user.email, id: user._id, first_name: user.first_name, last_name: user.last_name, role: user.role },
                process.env.JWT_SECRET,
                {},
                (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(user);
                }
            );
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: 'Server error. Please try again later.',
            });
        }
    };

    export const loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: 'No user found!' });
            }

            const match = await comparePasswords(password, user.password);
            if (match) {
                jwt.sign(
                    { email: user.email, id: user._id, first_name: user.first_name, last_name: user.last_name, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' },
                    (err, token) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error generating token' });
                        }

                        res.cookie('token', token, {
                            httpOnly: true,
                            sameSite: 'strict',
                            secure: process.env.NODE_ENV === 'production',
                        });

                        return res.status(200).json({
                            message: 'Login successful',
                            user: {
                                email: user.email,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                role: user.role
                            },
                        });
                    }
                );
            } else {
                return res.status(401).json({ error: 'Password is incorrect!' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error. Please try again later.' });
        }
    };

    export const getProfile = (req, res) => {
        const { token } = req.cookies;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
                if (err) throw err;
                res.json(user);
            });
        } else {
            res.json(null);
        }
    };

    export const logoutUser = (req, res) => {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
        return res.json({ message: 'Logged out successfully' });
    };

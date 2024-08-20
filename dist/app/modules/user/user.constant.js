"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.generateRandomPassword = exports.UserFilterableFields = exports.UserSearchableFields = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_smtp_transport_1 = __importDefault(require("nodemailer-smtp-transport"));
const config_1 = __importDefault(require("../../../config"));
exports.UserSearchableFields = [
    '_id',
    'email',
    'name',
    'email',
    'address.country',
    'address.city',
    'address.state',
    'phoneNumber',
    'birthPlace',
    'language',
    'education',
];
exports.UserFilterableFields = [
    'searchTerm',
    '_id',
    'email',
    'name',
    'email',
    'address.country',
    'address.city',
    'address.state',
    'phoneNumber',
    'birthPlace',
    'language',
    'education',
];
const generateRandomPassword = () => {
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
};
exports.generateRandomPassword = generateRandomPassword;
const sendEmail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport((0, nodemailer_smtp_transport_1.default)({
        service: 'Gmail',
        auth: {
            user: config_1.default.emailUser,
            pass: config_1.default.emailPassword,
        },
    }));
    const mailOptions = {
        from: config_1.default.emailFrom,
        to,
        subject,
        html,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendEmail = sendEmail;

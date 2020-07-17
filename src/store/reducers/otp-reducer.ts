import { handleActions, createAction } from 'redux-actions';

export interface IOtpState {
	cca: string;
	callingCode: number;
	number: string;
	otp: number;
}

export const defaultOtpState: IOtpState = {
	cca: 'IN',
	callingCode: 91,
	number: '',
	otp: 0
};

const SET_OTP_STATE = 'SET_OTP_STATE';
const SET_OTP = 'SET_OTP';

export const setOtpState = createAction<IOtpState>(SET_OTP_STATE);
export const setOtp = createAction<number>(SET_OTP);

export const otpReducer = handleActions<IOtpState>(
	{
		[SET_OTP_STATE]: (_state, { payload }) => {
			const otpState = (payload as any) as IOtpState;
			return {
				...otpState
			};
		},
		[SET_OTP]: (state, { payload }) => {
			const otp = (payload as any) as number;
			return {
				...state,
				otp
			};
		}
	},
	defaultOtpState
);

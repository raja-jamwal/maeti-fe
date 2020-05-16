import * as React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import Color from '../../constants/Colors';

const setParas1 = [
	"Maeti App  reserves the right in it's sole discretion to review the activity and status of each account and block access to the member based on such review.",
	"We reserve the right at its sole discretion to restrict/suspend your free access to its website based on review of the member's activity, status or any such criteria Maeti App may deem fit and proper with due intimation to you.",
	'You hereby confirm that as on date of this registration, you do not have any objection to receive emails, SMS/WhatsApp messages and calls from Maeti App and members of Maeti as long as you are a registered member. ',
	'Multiple profiles of the same person are not allowed and we reserve the right to deactivate all multiple profiles.',
	'You confirm that the Content, information including the personal information provided by you is correct and accurate.',
	'You are strongly advised to submit copy of your Driving License, Passport or any other Government issued identity to get a verified profile.',
	'Except for the purpose of promoting/advertising your profile for matchmaking purposes, you cannot engage in advertising to, or solicitation of, other Members to buy or sell any products or services through the Service.',
	'Maeti reserves the right to take appropriate steps to protect Maeti and/or its Members from any abuse/misuse as it deems appropriate in its sole discretion.',
	'Maeti reserves the right to screen communications/advertisements that you may send to other Member(s) and also regulate the same by deleting unwarranted/obscene communications/advertisements at any time at its sole discretion without prior notice to any Member.',
	'Members are expected to exercise simple precautions for their privacy and safety.',
	'Maeti Members who subscribe to the service hereby, unconditionally and irrevocably confirm that you have read terms and conditions and agree to abide by them.'
];

const setParas2 = [
	'Despite all we do to make the platform secure, we advise some precautions while using our app:',
	'If a user appears to have entered false, incorrect information about their education, profession, income, family etc., ‘Report ’ such profiles and refrain from contacting that user.',
	'If a user asks for personal favors like transportation of goods, deposit of funds on their behalf, lend them some money etc., immediately cease any communication with the user and do as advised above.',
	'Never share otp received by Maeti with anyone.',
	'Never share your financial details like bank account number, online banking credentials, credit card details etc. and be wary of those who ask for money from you. Use sound judgement and do not take any decision in a hurry.',
	'Meet with prospective partners you find on the platform in a safe place and inform your family or friends of the meeting.',
	'Do a thorough background research about the person before any commitments are made.'
];

export function Eula() {
	return (
		<ScrollView>
			<Text style={style.para}>
				Maeti is developed and maintained by DataGrid softwares LLP. We at DataGrid
				softwares LLP(hereinafter collectively and interchangeably referred to as
				“Maeti”/”Maeti App”) are committed to providing you with a secure platform . We help
				our users discover the best matches but it is in the interests of a user to use
				their best judgment to assess another person’s genuineness and interest in marriage.
			</Text>

			<Text style={[style.para, { fontWeight: 'bold' }]}>Terms of Use for Members.</Text>
			{setParas1.map((para, key) => (
				<Text key={key} style={style.para}>
					{para}
				</Text>
			))}
			{setParas2.map((para, key) => (
				<Text key={key} style={style.para}>
					{para}
				</Text>
			))}
		</ScrollView>
	);
}

const style = StyleSheet.create({
	para: {
		padding: 4,
		color: Color.offWhite
	}
});

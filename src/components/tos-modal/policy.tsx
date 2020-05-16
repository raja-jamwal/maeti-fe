import * as React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Color from '../../constants/Colors';

const setParas1 = [
	"Maeti is an advertising platform providing targeted advertising services for the purpose of matchmaking ('Service').Maeti is developed and maintained by DataGrid softwares LLP. We at DataGrid softwares LLP(hereinafter collectively and interchangeably referred to as “Maeti”/”Maeti App”) are committed to providing you with a secure platform.",
	'In order to do provide the services, we ask for certain personal information which is displayed on the Maeti App on behalf of you to find the perfect life partner. You hereby provide your consent to collect, process, and share of your personal information in order to provide the service.',
	'Your privacy is important to us, and so is being transparent about how we collect, use, and share information about you. This policy is intended to help you understand:',
	'Maeti gathers following types of information:',
	'Information submitted by you',
	'In order to avail the service you provide the following information:-',
	'While registering for our service, you share with us your personal details, such as name, your gender, date of birth, contact details, educational qualification, employment details, photos, marital status and your interests etc.',
	'Testimonials submitted by you including your success story and photos.',
	'Information submitted by you voluntarily while participating in surveys contest, promotions or events.',
	'Details shared with our customer care team. (This information used to monitor or for training purposes and to ensure a better service).',
	'Your chats and messages with other users as well as the content you publish will be processed as a part of the service.',
	'Information not directly submitted by you',
	'User activity',
	"We collect information about your activity on our services, such as date and time you logged in, features you've been using, searches, clicks and pages visited by you, your interaction with other users including messages exchanged.",
	'Device Information',
	'We collect information from and about the device(s) such as IP address, device ID and type, device-specification and apps settings, app error reports, browser type and version, operating system, identifiers associated with cookies or other technologies that may uniquely identify your device or browser.',
	'How do we use your information?',
	'We use the information collected in the following ways:',
	'we use the information submitted by you to provide the Service.',
	'manage your account',
	'provide you with customer support',
	'conduct research and analysis about your use of our services for providing better services',
	'communicate with you by email, phone about services, promotions or offers that may be of your interest.',
	'Recommend relevant matches to you and display your profile to other users.',
	'With whom do we share your information?',
	'With other users',
	'we publish the information shared by you with other users to provide the services. The information so published are provided by you and be cautious as what you share with other users.',
	'With our service providers and partners',
	'We may use third-party service providers to provide website and application development, hosting, maintenance, backup, storage, payment processing, analysis and other services for us, which may require them to access or use information about you. If a service provider needs to access information about you to perform services on our behalf, they do so under close instruction from us, including policies and procedures designed to protect your information. All of our service providers and partners agree to strict confidentiality obligations.',
	'With law enforcement agencies',
	'we will disclose your personally identifiable information as required by law and when we believe that disclosure is necessary to protect our rights, other members interest and protection and/or comply with a judicial proceeding, court order, or legal process served on our App.',
	'How long we keep your information?',
	'We keep your personal information only as long as you use our service and also as permitted/required by applicable law. In practice, we delete or anonymize your information upon deletion of your account, unless the same is required for to comply with legal obligations, fraud prevention, take actions we deem necessary to protect the integrity of our App or our users, to resolve disputes, to enforce our agreements, to support business operations, and to continue to develop and improve our Services. We retain information for better services, and we only use the information to analyse about the use of our Services, not to specifically analyse personal characteristics about you.',
	'Tell me how to contact Maeti App.',
	'Email us at : support@datagrids.com',
	'Customer Support : -91-73-87778-673'
];

export function Policy() {
	return (
		<ScrollView>
			{setParas1.map(para => (
				<Text style={style.para}>{para}</Text>
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

const html =
	'<!DOCTYPE html>\n' +
	'<html lang="en">\n' +
	'<head>\n' +
	'    <meta charset="UTF-8">\n' +
	'    <title>Payment</title>\n' +
	'    <script type="text/javascript" src="https://checkout.razorpay.com/v1/razorpay.js"></script>\n' +
	'</head>\n' +
	'<body onload="document.forms[0].submit();">\n' +
	'    <form style="visibility: hidden" name="theForm" method="POST" action="https://api.razorpay.com/v1/checkout/embedded">\n' +
	'        <input type="hidden" name="key_id" value="rzp_test_3umS10hV3WYmQm">\n' +
	'        <input type="hidden" name="order_id" value="orderId">\n' +
	'        <input type="hidden" name="name" value="Rishto">\n' +
	'        <input type="hidden" name="description" value="Sidhyun jo Sindhyun sa">\n' +
	'        <input type="hidden" name="image" value="https://s3.ap-south-1.amazonaws.com/matrimony.datagrids.in/icon.png">\n' +
	'        <input type="hidden" name="prefill[name]" value="fullName">\n' +
	'        <input type="hidden" name="prefill[email]" value="developer@datagrids.in">\n' +
	'        <input type="hidden" name="prefill[contact]" value="phoneNumber">\n' +
	'        <input type="hidden" name="callback_url" value="http://be.matri.datagrids.in:8080/api/order.success">\n' +
	'        <input type="hidden" name="cancel_url" value="http://be.matri.datagrids.in:8080/api/order.error">\n' +
	'        <button>Submit</button>\n' +
	'    </form>\n' +
	'</body>\n' +
	'</html>\n';

export const getRazor = (orderId: string, fullName: string, phoneNumber: string) => {
	return html
		.replace('orderId', orderId)
		.replace('fullName', fullName)
		.replace('phoneNumber', phoneNumber);
};

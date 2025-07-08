import { json, type RequestHandler } from '@sveltejs/kit';
import { GAS_API_URL } from '$env/static/private';

// GETリクエストのハンドラ (変更なし)
export const GET: RequestHandler = async () => {
	return json({ gasApiUrl: GAS_API_URL });
};

// POSTリクエストのハンドラ
export const POST: RequestHandler = async ({ request }) => {
	try {
		const requestData = await request.json(); // クライアントからのリクエストボディを取得

		const response = await fetch(GAS_API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestData), // GAS APIへ送信するデータ
		});

		if (!response.ok) {
			// GASからのエラーレスポンス
			const errorData = await response.json().catch(() => ({ message: 'Failed to parse GAS error response' }));
			return json({ error: true, message: `GAS API Error: ${response.statusText}`, details: errorData }, { status: response.status });
		}

		const responseData = await response.json(); // GASからのレスポンスボディを取得
		return json(responseData);

	} catch (error) {
		console.error('Error processing POST request to GAS:', error);
		let errorMessage = 'Internal Server Error';
		if (error instanceof Error) {
			errorMessage = error.message;
		}
		return json({ error: true, message: errorMessage }, { status: 500 });
	}
};

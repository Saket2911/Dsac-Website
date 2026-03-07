import fs from 'fs';
async function testApis() {
    const loginRes = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'saketkolla29@gmail.com', password: 'Saket@123' })
    });
    const authData = await loginRes.json();
    const token = authData.token;
    const headers = { 'Authorization': `Bearer ${token}` };

    const lbRes = await fetch('http://localhost:3001/api/leaderboard/xp', { headers });
    const lbData = await lbRes.json();

    const dqRes = await fetch('http://localhost:3001/api/daily-question', { headers });
    const dqData = await dqRes.json();

    const profRes = await fetch('http://localhost:3001/api/user/profile', { headers });
    const profData = await profRes.json();

    fs.writeFileSync('api_data.json', JSON.stringify({ lbData, dqData, profData }, null, 2));
}
testApis().catch(console.error);

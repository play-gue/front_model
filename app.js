const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000; 
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
let receivedData;
// JSON 데이터를 파싱하기 위한 미들웨어 등록
app.use(bodyParser.json());

// "Front" 디렉토리를 정적 파일로 서빙하기 위한 미들웨어를 등록합니다.
app.use(express.static(path.join(__dirname, 'Front')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Front', 'front.html'));
});

app.post('/sendData', async (req, res) => {
    try {
        receivedData = req.body;
        console.log('Received from app.js', receivedData);

        // 다른 로직 수행 또는 응답 보내기
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('에러:', error);
        res.status(500).json({ error: `에러: ${error.message}` });
    }
});
app.post('/runPython', async (req, res) => {
    try {
        
        // runPythonScript 함수에서 필요한 데이터로 receivedData를 사용
        const data = await runPythonScript(receivedData);
        // runPythonScript 실행 결과를 클라이언트에 응답
        res.json({ pythonData: data });
    } catch (error) {
        console.error('Python 에러:', error);
        res.status(500).json({ error: `Python 에러: ${error.message}` });
    }
});
function runPythonScript(receivedData){
    return new Promise((resolve, reject) => {
    
        const pythonProcess = spawn('python', ['GoToML.py', receivedData]);
        pythonProcess.stdout.on('data', (data) => {
            resolve(data.toString().trim());
        });
        
        pythonProcess.stderr.on('data', (data) => {//노드-파이썬 에러 처리
        reject(new Error(`Python error: ${data.toString()}`));
        });
    });
}

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});

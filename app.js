const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000; 
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

// JSON 데이터를 파싱하기 위한 미들웨어 등록
app.use(bodyParser.json());

// "Front" 디렉토리를 정적 파일로 서빙하기 위한 미들웨어를 등록합니다.
app.use(express.static(path.join(__dirname, 'Front')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Front', 'front.html'));
});

app.post('/sendData', async (req, res) => {
    const data_all = req.body;
    console.log('Received data:', data_all);

    try {
        const data = await runPythonScript(data_all);
    
        res.json({ pythonData: data });
    } catch (error) {//노드-프론트 에러 처리
        console.error('Python 에러:', error);
        res.status(500).json({ error: `Python 에러: ${error.message}` });
    }
});

function runPythonScript(data_all){
    return new Promise((resolve, reject) => {
    
        const pythonProcess = spawn('python', ['GoToML.py', data_all]);
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

import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import { RecoilRoot } from 'recoil';

// websocket
import { Buffer } from "buffer";
import "global";
window.Buffer = Buffer;
window.global = window;


createRoot(document.getElementById('root')).render(
    <BrowserRouter>

            <RecoilRoot>
            <App/>
            </RecoilRoot>

    </BrowserRouter>
)

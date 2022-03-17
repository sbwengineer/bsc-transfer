import React from 'react';
import { useEffect, useState } from "react";
import {Button, Row, Col, Card,Form} from 'react-bootstrap'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  connectWallet,
  getCurrentWalletConnected,
  transferToken,
} from './Integration'
function App() {
  const [wallet_address, setWalletAddress] = useState("");
  const [selected_token, setSelectedToken] = useState("usdt");
  const [token_amount, setTokenAmount] = useState(0.0);

	useEffect(() => {
		async function getInformation() {
			const { address,  } = await getCurrentWalletConnected();
			setWalletAddress(address);
			addWalletListener();
		}
    getInformation();
	}, [])

  function addWalletListener() {
		if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress("");
        }
      });
		} else {
		}
	}

  const handleBtnPressed = async() => {
    if(wallet_address === "") {
      const res = await connectWallet();
      if(res.address !== "")
        setWalletAddress(res.address);
      else
        alert(res.status);
    } else {
      if(token_amount <= 0)
      {
        alert("Token amount must be greater than 0");
        return;
      }
      await transferToken(wallet_address, selected_token, token_amount);
    }
  
  }

  return (
    <>
      <Card className='card-container' border="primary">
        <Card.Header>Transfer token</Card.Header>
        <Card.Body>
            <div className='body-part1'>
              <Form.Label className='heading-paragraph'>Counter block which will be updated every 1 hour</Form.Label>
              <h5>USDT-<span></span></h5>
              <h5>BUSDT-<span></span></h5>
              <h5>BNB-<span></span></h5>
            </div>
            <Row className='body-part2'>
              <Col>
                <Form.Control 
                type='number'
                min="0"
                placeholder="Amount"
                required
                onChange={(e) => {setTokenAmount(e.currentTarget.value)}}
                step="0.01"
                />
              </Col>
              <Col>
                <Form.Select onChange={(e) => {setSelectedToken(e.currentTarget.value)}}>
                  <option value="usdt">USDT</option>
                  <option value="busdt">BUSDT</option>
                  <option value="bnb">BNB</option>
                </Form.Select>
              </Col>
            </Row>
            <Button variant="primary" type="button" onClick={handleBtnPressed}>
                {wallet_address === "" ? 'Connect to Metamask' : "Send"}
            </Button>
        </Card.Body>
        <Card.Footer>Transfer tokens on BSC network</Card.Footer>
      </Card>
    </>
  );
}

export default App;

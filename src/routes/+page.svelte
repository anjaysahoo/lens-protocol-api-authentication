<script>
	import { ethers } from 'ethers';
	import { client, challenge, authenticate } from '../../src/api';

	let address;
	let token;
	let isConnected = false;
	async function checkConnection() {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const accounts = await provider.listAccounts()
		if (accounts.length) {
			address = accounts[0];
		}
	}

	async function connect() {
		console.log("connect called")
		/* this allows the user to connect their wallet */
		try {
			const account = await window.ethereum.send('eth_requestAccounts')
			if (account.result.length) {
				address = account.result[0];
				isConnected = true;
			}
			else{
				isConnected = false;
			}
		}
		catch (error) {
			console.log(error)
		}

	}

	async function login() {
		try {
			/* first request the challenge from the API server */
			const challengeInfo = await client.query(challenge, { address }).toPromise();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner()
			/* ask the user to sign a message with the challenge info returned from the server */
			const signature = await signer.signMessage(challengeInfo.data.challenge.text);
			/* authenticate the user */
			const authData = await client.mutation(authenticate, { address, signature }).toPromise();
			/* if user authentication is successful, you will receive an accessToken and refreshToken */
			const { data: { authenticate: { accessToken }}} = authData
			console.log({ accessToken })
			token = accessToken;
		} catch (err) {
			console.log('Error signing in: ', err)
		}
	}

</script>


<div class="main">

	<div class="btn-div">
		{#if !isConnected}
			<button on:click="{connect}" class="btn">Connect  Wallet</button>
		{:else}
			<div>
				<b>Connected Address :</b> {address}
			</div>
			<div>
				{#if !token}
					<button on:click={login} class="btn">Login</button>
				{:else}
					<b>Token :</b>  {token}
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.main{
		height: 100vh;
	}

	.btn-div{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		flex-direction: column;
		gap: 48px;
	}

	.btn {
		display: inline-block;
		outline: 0;
		border: 0;
		cursor: pointer;
		background: #000000;
		color: #FFFFFF;
		border-radius: 8px;
		padding: 14px 24px 16px;
		font-size: 18px;
		font-weight: 700;
		line-height: 1;
		transition: transform 200ms, background 200ms;
	}

</style>

import {createClient} from "@urql/svelte";

const API_URL = 'https://api.lens.dev'

export const client = createClient({
    url: API_URL
});


export const challenge =`
    query Challenge($address: EthereumAddress!) {
        challenge(request: { address: $address }) {
            text
        }
    }
`

export const authenticate =`
    mutation Authenticate(
        $address: EthereumAddress!
        $signature: Signature!
    ) {
        authenticate(request: {
            address: $address,
            signature: $signature
        }) {
            accessToken
            refreshToken
        }
    }
`

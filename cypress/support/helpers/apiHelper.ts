export class APIHelper {

    authorizationMethod (username: string, password:string) : string {

        let tokenAsString: string;

        cy.request({
            method: 'POST',
            url: '/',
            body: {username, password} 
        }).then(response => {
            expect(response.status). to.eq(200);
            
            const token: string = response.body.token;
            tokenAsString = String (token);
       
        });
        return tokenAsString;
    }


}

export default new APIHelper();
import { type } from 'cypress/types/jquery';
import auth from '../fixtures/auth.json'

describe ('Create a new board in Trello', () => {

    let boardId: string;
    let listsId: string;
    let cardId: string;
    const name: string = 'CYPRESS BOARD';

    it ('create a new board in trello', () =>{
        cy.request({
            method: 'POST',
            url: '/boards',
            qs: {
                key: auth.key,
                token: auth.token
            },
            body: {
                name: `${name}`
            }
         }).then(response => {
            expect(response.status).to.equal(200);
            expect(response.body.id).to.not.equal(0);
            expect(response.isOkStatusCode).to.be.true;
            expect(response.body.name).to.equal(`${name}`)

            boardId = response.body.id;

         });
    });


    
    it ('create a list on a board in trello', () =>{ 

        cy.request({
            method: 'POST',
            url: `boards/${boardId}/lists`,
            qs: {
                key: auth.key,
                token: auth.token
            },
            body: {
                name: 'Test List'
            }
        }).then(response => {
            expect(response.isOkStatusCode).to.be.true;
            expect(response.status).to.be.equal(200);
            expect(response.body.id).not.to.equal(0);
            expect(response.body.name).to.be.equal('Test List');

            listsId = response.body.id;

        });
    });

    it ('create a card on a board in trello', () =>{ 

        cy.request({
            method: 'POST',
            url: `/cards`,
            qs: {
                key: auth.key,
                token: auth.token,
                idList: `${listsId}`
            },
            body: {
                name: 'New Task'
            }
        }).then(response => {
            expect(response.isOkStatusCode).to.be.true;
            expect(response.status).to.be.equal(200);
            expect(response.body.id).not.to.equal(0);
            expect(response.body.name).to.be.equal('New Task');

            cardId = response.body.id;

        });
    });

    it ('move a card to next column in trello', () =>{ 
        let listIds = new Array(); 
        cy.request({
            method: 'GET',
            url: `/boards/${boardId}/lists/open`,
            qs: {
                key: auth.key,
                token: auth.token,
            }
        }).then(response => {
            expect(response.status).to.be.equal(200);
            
            const resultJson = response.body;
            const listIds = resultJson.map(item => item.id);

        

       
       listIds.forEach( (listId: string) => {
        cy.log(listId);
        cy.request({
            method: 'PUT',
            url: `/cards/${cardId}`,
            qs: {
                key: auth.key,
                token: auth.token
            },
            body: {
                idList: `${listId}`
            }
        }).then(response => {
            expect(response.isOkStatusCode).to.be.true;
            expect(response.status).to.be.equal(200);
            expect(response.body.id).not.to.equal(0);

        });
       }); 
    });
    });
})
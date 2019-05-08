import { Negociacoes, Negociacao, NegociacaoParcial  } from "../models/index";
import { NegociacoesView, MensagemView } from "../views/index";
import { domInject, throttle } from "../helpers/decorators/index";
import { NegociacaoService } from "../service/index";

export class NegociacaoController{
    
    @domInject('#data')
    private _inputData: JQuery;
    
    @domInject('#quantidade')
    private _inputQuantidade: JQuery;

    @domInject('#valor')
    private _inputValor: JQuery;

    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView = new MensagemView('#mensagemView');
    
    private _service = new NegociacaoService()
    constructor(){
        this._negociacoesView.update(this._negociacoes);
    }

    adiciona(event: Event){
        
        event.preventDefault();
        let data = new Date(this._inputData.val().replace(/-/g,'/'));

        if (!this._ehDiaUtil(data)) {
            this._mensagemView.update("Negociações só podem ser feitas em dias úteis");
            return
        }

        const negociacao = new Negociacao(
            data,
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
        );
        
        this._negociacoes.adiciona(negociacao);
        
        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso.');
    }

    private _ehDiaUtil(data : Date) : boolean {
        return data.getDay() != DiaDaSemana.Domingo && data.getDay() != DiaDaSemana.Sabado;
    }

    @throttle()
    importarDados(){
       
        this._service.obterNegociacoes(res => {          
            if (res.ok) return res;
            throw new Error(res.statusText);
        })
        .then(negociacoes => {
            negociacoes.forEach(necociacao => 
                this._negociacoes.adiciona(necociacao));
                this._negociacoesView.update(this._negociacoes);
        })
    }
}

enum DiaDaSemana {
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado
}
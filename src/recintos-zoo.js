class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: 3, especies: ['MACACO'] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: 0, especies: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: 1, especies: ['GAZELA'] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: 0, especies: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: 1, especies: ['LEAO'] }
        ];

        this.animais = {
            'LEAO': { tamanho: 3, biomas: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, biomas: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, biomas: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, biomas: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(tipoAnimal, quantidade) {
        if (!this.animais[tipoAnimal]) {
            return { erro: "Animal inválido" };
        }
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const { tamanho, biomas, carnivoro } = this.animais[tipoAnimal];
        const recintosViaveis = [];

        for (let recinto of this.recintos) {
            const espacoOcupadoExistente = this.calculaEspacoOcupadoExistente(recinto);
            const espacoLivre = recinto.tamanhoTotal - espacoOcupadoExistente;
            const novaEspecie = !recinto.especies.includes(tipoAnimal);
            const espacoNecessario = tamanho * quantidade + (novaEspecie && recinto.especies.length > 0 ? 1 : 0);

            if (
                this.verificaBiomaCompativel(biomas, recinto.bioma) &&
                this.verificaEspacoSuficiente(espacoLivre, espacoNecessario) &&
                this.verificaCarnivoroCompativel(carnivoro, recinto.especies, tipoAnimal) &&
                this.verificaHipopotamoCompativel(tipoAnimal, recinto) &&
                this.verificaMacacoCompativel(tipoAnimal, recinto, quantidade) &&
                this.verificaHipopotamoExistenteCompativel(recinto) &&
                this.verificaAnimaisExistentesCompativeis(recinto, tipoAnimal, carnivoro)
            ) {
                const espacoLivreAposAdicao = espacoLivre - espacoNecessario;
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivreAposAdicao} total: ${recinto.tamanhoTotal})`);
            }
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return { recintosViaveis };
    }

    calculaEspacoOcupadoExistente(recinto) {
        return recinto.especies.reduce((acc, especie) =>
            acc + this.animais[especie].tamanho * recinto.animaisExistentes, 0);
    }

    verificaBiomaCompativel(biomas, biomaRecinto) {
        return biomas.some(b => biomaRecinto.includes(b));
    }

    verificaEspacoSuficiente(espacoLivre, espacoNecessario) {
        return espacoLivre >= espacoNecessario;
    }

    verificaCarnivoroCompativel(carnivoro, especiesRecinto, tipoAnimal) {
        return !carnivoro || (especiesRecinto.length === 0 || especiesRecinto[0] === tipoAnimal);
    }

    verificaHipopotamoCompativel(tipoAnimal, recinto) {
        return tipoAnimal !== 'HIPOPOTAMO' || recinto.bioma === 'savana e rio' || recinto.especies.length === 0;
    }

    verificaMacacoCompativel(tipoAnimal, recinto, quantidade) {
        return tipoAnimal !== 'MACACO' || recinto.animaisExistentes > 0 || quantidade > 1;
    }

    verificaHipopotamoExistenteCompativel(recinto) {
        return !recinto.especies.includes('HIPOPOTAMO') || recinto.bioma === 'savana e rio';
    }

    verificaAnimaisExistentesCompativeis(recinto, tipoAnimal, carnivoro) {
        return recinto.especies.length === 0 ||
            (recinto.especies[0] === tipoAnimal && !carnivoro) ||
            (recinto.especies[0] !== tipoAnimal && !carnivoro && this.animais[recinto.especies[0]].carnivoro === false);
    }
}


export { RecintosZoo as RecintosZoo };

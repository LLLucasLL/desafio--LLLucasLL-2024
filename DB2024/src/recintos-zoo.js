class RecintosZoo {

    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [{ especie: 'LEAO', quantidade: 1 }] },
        ];

        this.animais = {
            LEAO: { tamanho: 3, bioma: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, bioma: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, bioma: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, bioma: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false },
        };
    }

    // Verifica se o bioma do recinto é compatível com o animal
    biomaEhCompativel(animal, recinto) {
        return this.animais[animal].bioma.includes(recinto.bioma) || (recinto.bioma === 'savana e rio' && this.animais[animal].bioma.includes('savana'));
    }

    // Calcula o espaço disponível em um recinto
    espacoRestante(recinto) {
        let espacoOcupado = recinto.animaisExistentes.reduce((total, animal) => total + (this.animais[animal.especie].tamanho * animal.quantidade), 0);
        return recinto.tamanhoTotal - espacoOcupado;
    }

    // Verifica se o novo animal é compatível com os animais já presentes no recinto
    verificarCompatibilidade(recinto, novoAnimal, quantidade) {
        let carnívoroNoRecinto = recinto.animaisExistentes.some(a => this.animais[a.especie].carnivoro);
        let animalCarnivoro = this.animais[novoAnimal].carnivoro;

        // Animais carnívoros só podem habitar com a própria espécie
        if (animalCarnivoro && recinto.animaisExistentes.length > 0) return false;
        if (carnívoroNoRecinto && !animalCarnivoro) return false;

        // Hipopótamos só toleram outras espécies em "savana e rio"
        if (novoAnimal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && recinto.animaisExistentes.length > 0) return false;

        // Macacos precisam de outro animal no recinto
        if (novoAnimal === 'MACACO' && quantidade === 1 && recinto.animaisExistentes.length === 0) return false;

        // Verificar se os animais existentes continuarão confortáveis com o novo animal
        for (let animalExistente of recinto.animaisExistentes) {
            if (animalExistente.especie === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && novoAnimal !== 'HIPOPOTAMO') return false;
            if (this.animais[animalExistente.especie].carnivoro && novoAnimal !== animalExistente.especie) return false;
        }

        return true;
    }

    // Calcula o espaço que restará após a inserção do novo animal
    calcularEspacoComNovoAnimal(recinto, novoAnimal, quantidade) {
        let espacoExtra = recinto.animaisExistentes.length > 0 ? 1 : 0; // Espaço extra se houver mais de uma espécie
        let espacoOcupado = (quantidade * this.animais[novoAnimal].tamanho) + espacoExtra;
        return this.espacoRestante(recinto) - espacoOcupado;
    }

    // Função principal para encontrar recintos viáveis
    analisaRecintos(animal, quantidade) {
        // Verificar se o animal é válido
        if (!this.animais[animal]) return { erro: "Animal inválido", recintosViaveis: null };

        // Verificar se a quantidade é válida
        if (quantidade <= 0 || !Number.isInteger(quantidade)) return { erro: "Quantidade inválida", recintosViaveis: null };

        let recintosViaveis = [];

        // Percorrer todos os recintos
        for (let recinto of this.recintos) {
            if (this.biomaEhCompativel(animal, recinto) && this.verificarCompatibilidade(recinto, animal, quantidade)) {
                let espacoLivre = this.calcularEspacoComNovoAnimal(recinto, animal, quantidade);
                if (espacoLivre >= 0) {
                    recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`);
                }
            }
        }

        // Retornar os recintos viáveis ou uma mensagem de erro
        return recintosViaveis.length > 0 ? { erro: null, recintosViaveis } : { erro: "Não há recinto viável", recintosViaveis: null };
    }
}

export { RecintosZoo as RecintosZoo };

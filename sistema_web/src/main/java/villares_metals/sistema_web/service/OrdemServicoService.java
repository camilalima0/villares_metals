package villares_metals.sistema_web.service;

import jakarta.persistence.criteria.Expression;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import villares_metals.sistema_web.domain.OrdemServico;
import villares_metals.sistema_web.domain.OrdenaProduto;
import villares_metals.sistema_web.domain.enums.StatusProducao;
import villares_metals.sistema_web.repository.OrdemServicoRepository;
import villares_metals.sistema_web.repository.OrdenaProdutoRepository;
import villares_metals.sistema_web.repository.ProdutoRepository;

@Service
public class OrdemServicoService {
    
    // Repositórios declarados como final
    private final OrdenaProdutoRepository ordenaProdutoRepository;
    private final ProdutoRepository produtoRepository; // Adicionado para buscar Produto
    
    //instancia o repositorio de os
    @Autowired
    private final OrdemServicoRepository ordemServicoRepository;
    
    public OrdemServicoService(
            OrdemServicoRepository ordemServicoRepository,
            OrdenaProdutoRepository ordenaProdutoRepository,
            ProdutoRepository produtoRepository
    ) {
        this.ordemServicoRepository = ordemServicoRepository;
        this.ordenaProdutoRepository = ordenaProdutoRepository;
        this.produtoRepository = produtoRepository;
    }
    
    //recupera os por id
    public OrdemServico getOS(Integer id) {
        return ordemServicoRepository.findOSById(id);
    }
    
    //lista todas as os
    public List<OrdemServico> listarOS() {
        return ordemServicoRepository.findAll();
    }
    
    //salva ou atualiza os no db
     @Transactional
    public OrdemServico postOS(OrdemServico os) {
        // 1. Separa os itens para processamento manual
        List<OrdenaProduto> itensTemp = os.getItensDoPedido();
        // Limpa a lista na OS para salvar a OS 'pura' primeiro sem conflitos de cascade
        os.setItensDoPedido(null); 
        
        // --- LÓGICA DE DATA DE APROVAÇÃO ---
        // Se for uma nova ordem (ID nulo) e a data de aprovação não foi enviada,
        // define como a data/hora atual.
        if (os.getIdOS() == null && os.getDataAprovacao() == null) {
            os.setDataAprovacao(java.time.LocalDateTime.now());
        }

        // 2. Salva a OS para garantir que temos um ID
        OrdemServico novaOs = ordemServicoRepository.save(os);
        
        // 3. Se houver itens, processa e salva cada um
        if (itensTemp != null && !itensTemp.isEmpty()) {
            List<OrdenaProduto> itensSalvos = new ArrayList<>();
            
            for (OrdenaProduto item : itensTemp) {
                // Configura a chave composta
                if (item.getId() == null) {
                     item.setId(new villares_metals.sistema_web.domain.ids.OrdenaProdutoId());
                }
                item.getId().setOs(novaOs.getIdOS());
                
                if (item.getProduto() != null && item.getProduto().getIdProduto() != null) {
                     Integer idProd = item.getProduto().getIdProduto();
                     item.getId().setProduto(idProd);
                     
                     // Carrega a referência do produto para o contexto de persistência
                     // getReference evita um SELECT desnecessário se o objeto apenas precisar ser linkado
                     villares_metals.sistema_web.domain.Produto produtoRef = produtoRepository.getReferenceById(idProd);
                     item.setProduto(produtoRef);
                }
                
                // Vincula a OS salva ao item
                item.setOrdemServico(novaOs);

                // CORREÇÃO: Usar merge ou save. O save do repositório chama persist se for novo ou merge se não for.
                // Como é uma chave composta, o Hibernate às vezes se confunde se o objeto é novo ou não.
                // Vamos garantir que estamos salvando uma nova instância limpa.
                itensSalvos.add(ordenaProdutoRepository.save(item));
            }
            
            // Reconecta a lista salva ao objeto de retorno para o frontend receber completo
            novaOs.setItensDoPedido(itensSalvos);
        }
        
        return novaOs;
    }
    
    @Transactional
    public void deleteOS(Integer id) {
        // Dependendo do Cascade, pode ser necessário deletar os itens antes
        // Se der erro de FK ao deletar, descomente a linha abaixo:
        // ordenaProdutoRepository.deleteByOrdemServicoId(id); 
        ordemServicoRepository.deleteById(id);
    }
    
    // --- MÉTODO DE BUSCA AVANÇADA ---
    public List<OrdemServico> buscarAvancada(
            Integer idOS,
            String nomeCliente,
            String cnpjCliente,
            LocalDateTime dataAprovacao,
            LocalDate dataInicio, 
            LocalDate dataFim, 
            Double valorMin, 
            Double valorMax, 
            Boolean statusPagamento, 
            String statusProducao, 
            String descricao
    ) {
        // Cria a especificação (query dinâmica)
        Specification<OrdemServico> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // CORREÇÃO: Extrair expressões tipadas para ajudar o compilador
            
            // 1. Filtro de Datas
            
            if (dataInicio != null || dataFim != null) {
                Expression<LocalDate> dataEntregaPath = root.get("dataEntrega").as(LocalDate.class);
                
                if (dataInicio != null) {
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(dataEntregaPath, dataInicio));
                }
                if (dataFim != null) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(dataEntregaPath, dataFim));
                }
            }

            // 2. Filtro de Valores
            if (valorMin != null || valorMax != null) {
                Expression<Double> valorPath = root.get("valorServico").as(Double.class);
                
                if (valorMin != null) {
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(valorPath, valorMin));
                }
                if (valorMax != null) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(valorPath, valorMax));
                }
            }

            // 3. Filtro por Status Pagamento
            if (statusPagamento != null) {
                predicates.add(criteriaBuilder.equal(root.get("statusPagamento"), statusPagamento));
            }

            // 4. Filtro por Status Produção (Enum)
            if (statusProducao != null && !statusProducao.isEmpty()) {
                try {
                    StatusProducao status = StatusProducao.valueOf(statusProducao.toUpperCase());
                    predicates.add(criteriaBuilder.equal(root.get("statusProducao"), status));
                } catch (IllegalArgumentException e) {
                    // Ignora status inválido
                }
            }

            // 5. Filtro por Descrição
            if (descricao != null && !descricao.isEmpty()) {
                // Força o cast para String para evitar ambiguidade
                Expression<String> descricaoPath = root.get("descricao").as(String.class);
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(descricaoPath), 
                    "%" + descricao.toLowerCase() + "%"
                ));
            }

            // Combina todos os predicados com AND
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        // Executa a busca usando a especificação criada
        return ordemServicoRepository.findAll(spec);
    }
}
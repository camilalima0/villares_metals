package villares_metals.sistema_web.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.time.LocalDate; 
import java.time.LocalDateTime;
import java.util.List;
import villares_metals.sistema_web.domain.enums.StatusProducao;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ordem_servico")
public class OrdemServico implements Serializable{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "n_os")
    private Integer idOS;
    @Column(name = "descricao_pedido")
    private String descricao;
    @Column(name = "data_entrega")
    private LocalDate dataEntrega;
    @Column(name = "data_aprovacao")
    private LocalDateTime dataAprovacao;
    @Column(name = "status_pagamento")
    private Boolean statusPagamento;
    @Enumerated(EnumType.STRING)
    @Column(name = "status_producao")
    private StatusProducao statusProducao;
    @Column(name = "valor_servico")
    private double valorServico;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente") // O nome da coluna FK na tabela ordem_servico
    @JsonBackReference
    private Cliente cliente;
    // NOVO CAMPO: Lista de itens associativos (Ordem de Serviço 1:N OrdenaProduto)
    @OneToMany(mappedBy = "ordemServico", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference // Indica ao Jackson que este lado deve ser serializado
    private List<OrdenaProduto> itensDoPedido; // Nome do campo usado no Service/Controller

}
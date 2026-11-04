package com.ufla.trabalho_empreendedorismo.ecoobra.repository;

import com.ufla.trabalho_empreendedorismo.ecoobra.domain.Pedido;
import com.ufla.trabalho_empreendedorismo.ecoobra.domain.StatusPedido;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long>, JpaSpecificationExecutor<Pedido>, PagingAndSortingRepository<Pedido, Long> {
    Optional<Pedido> findByCodigo(String codigo);
    List<Pedido> findByGeradorId(Long geradorId);
    List<Pedido> findByFreteiroId(Long freteiroId);
    List<Pedido> findByStatus(StatusPedido status);
    List<Pedido> findByStatusAndFreteiroIsNull(StatusPedido status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Pedido p where p.id = :id")
    Optional<Pedido> lockById(@Param("id") Long id);
}

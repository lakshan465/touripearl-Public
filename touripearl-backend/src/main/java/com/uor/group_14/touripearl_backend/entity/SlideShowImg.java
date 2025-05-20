package com.uor.group_14.touripearl_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Table(name="slideShowImg")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class SlideShowImg {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    private String dir;


    private String url;


    private String hash;


    private String name;
}
package com.uor.group_14.touripearl_backend.entity.guideApplication;

import com.uor.group_14.touripearl_backend.entity.enumEntity.LanguageLevel;
import com.uor.group_14.touripearl_backend.entity.enumEntity.LanguageName;
import com.uor.group_14.touripearl_backend.entity.guide.Guide;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name="application_language")
public class ApplicationLanguage {
    @Id
    @Column(name="language_id",length = 100)
    private String languageId;

    @Enumerated(EnumType.STRING)
    private LanguageName languageName;

    @Enumerated(EnumType.STRING)
    private LanguageLevel languageLevel;

    @ManyToOne
    @JoinColumn(name = "guide_application_id")
    private GuideApplication guideApplication;

    @ManyToOne
    @JoinColumn(name = "guide_id")
    private Guide guidelanguage;
}

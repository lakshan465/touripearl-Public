package com.uor.group_14.touripearl_backend.dto.response;

import com.uor.group_14.touripearl_backend.entity.enumEntity.LanguageLevel;
import com.uor.group_14.touripearl_backend.entity.enumEntity.LanguageName;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApplicationLanguageResponseDto {
    private LanguageName languageName;
    private LanguageLevel languageLevel;
}

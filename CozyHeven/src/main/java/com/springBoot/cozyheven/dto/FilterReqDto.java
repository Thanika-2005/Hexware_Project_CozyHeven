package com.springBoot.cozyheven.dto;

import java.util.List;

public record FilterReqDto(
String location,
Integer rating,
List<String>amenityNames
) { }

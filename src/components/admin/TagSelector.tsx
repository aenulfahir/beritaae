"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Hash, Loader2, Search } from "lucide-react";
import {
  getAllTags,
  searchTags,
  createTag,
  getArticleTags,
  addTagToArticle,
  removeTagFromArticle,
  Tag,
} from "@/lib/supabase/services/tags";

interface TagSelectorProps {
  articleId?: string; // If editing existing article
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

export function TagSelector({
  articleId,
  selectedTags,
  onTagsChange,
}: TagSelectorProps) {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load all tags on mount
  useEffect(() => {
    const loadTags = async () => {
      setIsLoading(true);
      try {
        const tags = await getAllTags();
        setAllTags(tags);
        setSearchResults(tags.slice(0, 10));
      } catch (error) {
        console.error("Error loading tags:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTags();
  }, []);

  // Load article tags if editing
  useEffect(() => {
    if (articleId) {
      const loadArticleTags = async () => {
        try {
          const tags = await getArticleTags(articleId);
          onTagsChange(tags);
        } catch (error) {
          console.error("Error loading article tags:", error);
        }
      };
      loadArticleTags();
    }
  }, [articleId]);

  // Search tags when query changes
  useEffect(() => {
    const search = async () => {
      if (searchQuery.trim()) {
        const results = await searchTags(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults(allTags.slice(0, 10));
      }
    };
    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, allTags]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleAddTag = async (tag: Tag) => {
    if (selectedTags.find((t) => t.id === tag.id)) return;

    const newSelectedTags = [...selectedTags, tag];
    onTagsChange(newSelectedTags);

    // If editing existing article, save to database
    if (articleId) {
      await addTagToArticle(articleId, tag.id);
    }

    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleRemoveTag = async (tagId: string) => {
    const newSelectedTags = selectedTags.filter((t) => t.id !== tagId);
    onTagsChange(newSelectedTags);

    // If editing existing article, remove from database
    if (articleId) {
      await removeTagFromArticle(articleId, tagId);
    }
  };

  const handleCreateTag = async () => {
    const tagName = newTagName.trim() || searchQuery.trim();
    if (!tagName) return;

    setIsCreating(true);
    try {
      const slug = generateSlug(tagName);
      const newTag = await createTag(tagName, slug);

      if (newTag) {
        setAllTags([newTag, ...allTags]);
        await handleAddTag(newTag);
        setNewTagName("");
        setSearchQuery("");
      }
    } catch (error) {
      console.error("Error creating tag:", error);
    } finally {
      setIsCreating(false);
    }
  };

  // Filter out already selected tags from search results
  const availableTags = searchResults.filter(
    (tag) => !selectedTags.find((t) => t.id === tag.id)
  );

  // Check if search query matches any existing tag
  const queryMatchesExisting = allTags.some(
    (tag) => tag.name.toLowerCase() === searchQuery.toLowerCase().trim()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Tags / Hashtag
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="px-3 py-1.5 text-sm flex items-center gap-1"
                style={{
                  backgroundColor: `${tag.color}20`,
                  borderColor: tag.color,
                  color: tag.color,
                }}
              >
                #{tag.name}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.id)}
                  className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                  title={`Hapus tag ${tag.name}`}
                  aria-label={`Hapus tag ${tag.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Search/Add Input */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Cari atau buat tag baru..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="pl-9"
            />
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {isLoading ? (
                <div className="p-4 text-center">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                </div>
              ) : (
                <>
                  {/* Create new tag option */}
                  {searchQuery.trim() && !queryMatchesExisting && (
                    <button
                      type="button"
                      onClick={handleCreateTag}
                      disabled={isCreating}
                      className="w-full px-3 py-2 text-left hover:bg-accent flex items-center gap-2 border-b"
                    >
                      {isCreating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 text-green-500" />
                      )}
                      <span>
                        Buat tag baru:{" "}
                        <strong className="text-primary">
                          #{searchQuery.trim()}
                        </strong>
                      </span>
                    </button>
                  )}

                  {/* Available tags */}
                  {availableTags.length > 0 ? (
                    availableTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        className="w-full px-3 py-2 text-left hover:bg-accent flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                          #{tag.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {tag.usage_count} artikel
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-muted-foreground text-sm">
                      {searchQuery.trim()
                        ? "Tidak ada tag yang cocok"
                        : "Belum ada tag"}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Tag membantu pembaca menemukan artikel terkait dan meningkatkan
          trending score.
        </p>
      </CardContent>
    </Card>
  );
}
